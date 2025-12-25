from flask import Blueprint, request, jsonify
from extensions import db
from models import DisputedLand
from datetime import datetime, date
from sqlalchemy import or_, and_

disputed_lands_bp = Blueprint('disputed_lands', __name__)

@disputed_lands_bp.route('/disputed-lands', methods=['GET'])
def get_disputed_lands():
    """Get all disputed lands with optional filtering"""
    try:
        # Query parameters
        district = request.args.get('district')
        tehsil = request.args.get('tehsil')
        dispute_type = request.args.get('dispute_type')
        status = request.args.get('status')
        page = int(request.args.get('page', 1))
        per_page = int(request.args.get('per_page', 50))
        
        # Build query
        query = DisputedLand.query
        
        if district:
            query = query.filter(DisputedLand.district == district)
        if tehsil:
            query = query.filter(DisputedLand.tehsil == tehsil)
        if dispute_type:
            query = query.filter(DisputedLand.dispute_type == dispute_type)
        if status:
            query = query.filter(DisputedLand.dispute_status == status)
        
        # Paginate
        paginated = query.paginate(page=page, per_page=per_page, error_out=False)
        
        return jsonify({
            'success': True,
            'data': {
                'lands': [land.to_dict() for land in paginated.items],
                'total': paginated.total,
                'pages': paginated.pages,
                'current_page': page
            }
        })
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@disputed_lands_bp.route('/disputed-lands/map-data', methods=['GET'])
def get_map_data():
    """Get all disputed lands with location data for map visualization"""
    try:
        district = request.args.get('district')
        tehsil = request.args.get('tehsil')
        
        query = DisputedLand.query.filter(
            DisputedLand.latitude.isnot(None),
            DisputedLand.longitude.isnot(None)
        )
        
        if district:
            query = query.filter(DisputedLand.district == district)
        if tehsil:
            query = query.filter(DisputedLand.tehsil == tehsil)
        
        lands = query.all()
        
        map_data = [{
            'id': land.id,
            'khasra_number': land.khasra_number,
            'mauza': land.mauza,
            'tehsil': land.tehsil,
            'district': land.district,
            'latitude': land.latitude,
            'longitude': land.longitude,
            'dispute_type': land.dispute_type,
            'dispute_status': land.dispute_status,
            'area_kanal': land.area_kanal,
            'claimants_count': len(land.claimants) if land.claimants else 0,
            'partition_impact': land.partition_impact
        } for land in lands]
        
        return jsonify({
            'success': True,
            'data': map_data
        })
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@disputed_lands_bp.route('/disputed-lands/<land_id>', methods=['GET'])
def get_disputed_land(land_id):
    """Get single disputed land details"""
    try:
        land = DisputedLand.query.get(land_id)
        if not land:
            return jsonify({'success': False, 'error': 'Land not found'}), 404
        
        return jsonify({
            'success': True,
            'data': land.to_dict()
        })
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@disputed_lands_bp.route('/disputed-lands', methods=['POST'])
def create_disputed_land():
    """Create a new disputed land record"""
    try:
        data = request.get_json()
        
        land = DisputedLand(
            khasra_number=data.get('khasra_number'),
            mauza=data.get('mauza'),
            tehsil=data.get('tehsil'),
            district=data.get('district'),
            dispute_type=data.get('dispute_type'),
            dispute_description=data.get('dispute_description'),
            claimants=data.get('claimants', []),
            latitude=data.get('latitude'),
            longitude=data.get('longitude'),
            area_kanal=data.get('area_kanal'),
            area_marla=data.get('area_marla'),
            land_type=data.get('land_type'),
            historical_owner=data.get('historical_owner'),
            partition_impact=data.get('partition_impact', False),
            redistribution_year=data.get('redistribution_year'),
            case_number=data.get('case_number'),
            filed_date=datetime.strptime(data['filed_date'], '%Y-%m-%d').date() if data.get('filed_date') else None,
            court_jurisdiction=data.get('court_jurisdiction')
        )
        
        db.session.add(land)
        db.session.commit()
        
        return jsonify({
            'success': True,
            'data': land.to_dict()
        }), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'error': str(e)}), 500

@disputed_lands_bp.route('/disputed-lands/<land_id>', methods=['PUT'])
def update_disputed_land(land_id):
    """Update disputed land record"""
    try:
        land = DisputedLand.query.get(land_id)
        if not land:
            return jsonify({'success': False, 'error': 'Land not found'}), 404
        
        data = request.get_json()
        
        # Update fields
        for field in ['dispute_status', 'dispute_description', 'claimants', 'latitude', 
                      'longitude', 'case_number', 'court_jurisdiction']:
            if field in data:
                setattr(land, field, data[field])
        
        # Handle date fields
        if 'last_hearing_date' in data and data['last_hearing_date']:
            land.last_hearing_date = datetime.strptime(data['last_hearing_date'], '%Y-%m-%d').date()
        if 'next_hearing_date' in data and data['next_hearing_date']:
            land.next_hearing_date = datetime.strptime(data['next_hearing_date'], '%Y-%m-%d').date()
        
        if data.get('dispute_status') == 'resolved' and not land.resolved_at:
            land.resolved_at = datetime.utcnow()
        
        land.updated_at = datetime.utcnow()
        db.session.commit()
        
        return jsonify({
            'success': True,
            'data': land.to_dict()
        })
    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'error': str(e)}), 500

@disputed_lands_bp.route('/disputed-lands/<land_id>', methods=['DELETE'])
def delete_disputed_land(land_id):
    """Delete disputed land record"""
    try:
        land = DisputedLand.query.get(land_id)
        if not land:
            return jsonify({'success': False, 'error': 'Land not found'}), 404
        
        db.session.delete(land)
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': 'Disputed land record deleted'
        })
    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'error': str(e)}), 500

@disputed_lands_bp.route('/disputed-lands/stats', methods=['GET'])
def get_dispute_stats():
    """Get statistics on disputed lands"""
    try:
        total = DisputedLand.query.count()
        by_type = db.session.query(
            DisputedLand.dispute_type,
            db.func.count(DisputedLand.id)
        ).group_by(DisputedLand.dispute_type).all()
        
        by_status = db.session.query(
            DisputedLand.dispute_status,
            db.func.count(DisputedLand.id)
        ).group_by(DisputedLand.dispute_status).all()
        
        by_district = db.session.query(
            DisputedLand.district,
            db.func.count(DisputedLand.id)
        ).group_by(DisputedLand.district).all()
        
        partition_affected = DisputedLand.query.filter_by(partition_impact=True).count()
        
        return jsonify({
            'success': True,
            'data': {
                'total_disputes': total,
                'by_type': {dtype: count for dtype, count in by_type},
                'by_status': {status: count for status, count in by_status},
                'by_district': {district: count for district, count in by_district},
                'partition_affected': partition_affected
            }
        })
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@disputed_lands_bp.route('/disputed-lands/districts', methods=['GET'])
def get_districts():
    """Get list of districts with disputed lands"""
    try:
        districts = db.session.query(DisputedLand.district).distinct().all()
        return jsonify({
            'success': True,
            'data': [d[0] for d in districts if d[0]]
        })
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@disputed_lands_bp.route('/disputed-lands/tehsils', methods=['GET'])
def get_tehsils():
    """Get list of tehsils with disputed lands"""
    try:
        district = request.args.get('district')
        query = db.session.query(DisputedLand.tehsil).distinct()
        
        if district:
            query = query.filter(DisputedLand.district == district)
        
        tehsils = query.all()
        return jsonify({
            'success': True,
            'data': [t[0] for t in tehsils if t[0]]
        })
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500
